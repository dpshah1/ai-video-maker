from manim import *

class GraphsAnimation(Scene):
    def construct(self):
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        complete_graph = VGroup()
        for n in range(2, 6):
            circle = Circle(radius=0.5)
            self.play(Create(circle))
            self.wait(0.5)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(0.5)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(0.5)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(0.5)

        self.play(FadeOut(circle))
        self.wait(0.5)

    def create_complete_graph(self, n):
        vertices = [Circle(radius=0.1).shift(2 * RIGHT * i) for i in range(n)]
        edges = []
        for i in range(n):
            for j in range(i + 1, n):
                edge = Line(vertices[i].get_center(), vertices[j].get_center())
                edges.append(edge)
        complete_graph = VGroup(*vertices, *edges)
        return complete_graph

    def create_tree(self):
        root = Circle(radius=0.1).shift(UP * 2)
        left_child = Circle(radius=0.1).shift(LEFT + DOWN)
        right_child = Circle(radius=0.1).shift(RIGHT + DOWN)
        edge1 = Line(root.get_center(), left_child.get_center())
        edge2 = Line(root.get_center(), right_child.get_center())
        tree = VGroup(root, left_child, right_child, edge1, edge2)
        return tree

    def create_hypercube(self):
        hypercube_shapes = []
        for dim in range(1, 5):
            shape = self.create_hypercube_shape(dim)
            hypercube_shapes.append(shape)
        return hypercube_shapes

    def create_hypercube_shape(self, dim):
        if dim == 1:
            return Line(LEFT, RIGHT)
        if dim == 2:
            square = Square(side_length=1)
            return square
        if dim == 3:
            cube = Cube()
            return cube

        return Text("4D Hypercube (Conceptual)").scale(0.5)