"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DocumentData } from "firebase/firestore"
import Image from "next/image"

interface ImageGridProps {
    images: DocumentData[]
}

export default function ImageGrid({ images }: ImageGridProps) {


    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {images?.map((image) => (
                <Dialog key={image.id}>
                    <DialogTrigger asChild>
                        <div
                            className="cursor-pointer transition-opacity hover:opacity-80"
                        >
                            <AspectRatio ratio={image.aspectRatio} className="border">
                                <Image
                                    width={image.width}
                                    height={image.height}
                                    src={image.url}
                                    alt={image.prompt}
                                    className="rounded-md object-cover"
                                />
                            </AspectRatio>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Image Details</DialogTitle>
                            <DialogDescription>
                                View the image and its details below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="relative aspect-square overflow-hidden rounded-lg border">
                                <Image
                                    src={image.url}
                                    alt={image.prompt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-1">
                                    <h4 className="font-medium">Prompt</h4>
                                    <p className="text-muted-foreground text-sm">{image.prompt}</p>
                                </div>
                                <div className="grid gap-1">
                                    <h4 className="font-medium">Dimensions</h4>
                                    <p className="text-muted-foreground text-sm">
                                        {image.width} x {image.height}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <h4 className="font-medium">Created At</h4>
                                    <p className="text-muted-foreground text-sm">
                                        {new Date(
                                            image.createdAt?.seconds
                                                ? image.createdAt.seconds * 1000
                                                : image.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <h4 className="font-medium">ID</h4>
                                    <p className="text-muted-foreground font-mono text-xs">
                                        {image.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    )
}
